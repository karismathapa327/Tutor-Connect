const Availability = require("../models/Availability");

class AvailabilityService {
  async createSlot(tutorId, slotData) {
    const { date, startTime, endTime } = slotData;

    if (!date || !startTime || !endTime) {
      throw new Error("date, startTime, and endTime are required.");
    }

    if (startTime >= endTime) {
      throw new Error("startTime must be before endTime.");
    }

    const slotDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (slotDate < today) {
      throw new Error("Cannot create slots in the past.");
    }

    const existingSlot = await Availability.findOne({
      tutor: tutorId,
      date: slotDate,
      startTime,
      endTime,
      status: "available",
    });

    if (existingSlot) {
      throw new Error("This slot already exists.");
    }

    const slot = await Availability.create({
      tutor: tutorId,
      date: slotDate,
      startTime,
      endTime,
      status: "available",
    });

    return slot;
  }

  async getTutorSlots(tutorId, dateFilter) {
    const query = { tutor: tutorId };

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.date = {
        $gte: filterDate,
        $lt: nextDay,
      };
    }

    const slots = await Availability.find(query).sort({ startTime: 1 });

    return {
      count: slots.length,
      slots,
    };
  }

  async getAvailableSlots(tutorId, dateFilter) {
    const query = { tutor: tutorId, status: "available" };

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.date = {
        $gte: filterDate,
        $lt: nextDay,
      };
    }

    const slots = await Availability.find(query).sort({ startTime: 1 });

    return {
      count: slots.length,
      slots,
    };
  }

  async bookSlot(slotId, studentId) {
    const slot = await Availability.findOne({
      _id: slotId,
      status: "available",
    });

    if (!slot) {
      const alreadyBooked = await Availability.findOne({
        _id: slotId,
        status: "booked",
      });

      if (alreadyBooked) {
        throw new Error("This slot has already been booked by another student.");
      }
      throw new Error("Slot not found.");
    }

    const bookedSlot = await Availability.findOneAndUpdate(
      { _id: slotId, status: "available" },
      {
        status: "booked",
        bookedBy: studentId,
      },
      { new: true }
    );

    if (!bookedSlot) {
      throw new Error("This slot was just booked by another student. Please select another slot.");
    }

    return bookedSlot;
  }

  async releaseSlot(slotId) {
    const slot = await Availability.findOne({
      _id: slotId,
      status: "booked",
    });

    if (!slot) {
      return null;
    }

    const releasedSlot = await Availability.findOneAndUpdate(
      { _id: slotId, status: "booked" },
      {
        status: "available",
        bookedBy: null,
        sessionId: null,
      },
      { new: true }
    );

    return releasedSlot;
  }

  async deleteSlot(slotId, tutorId) {
    const slot = await Availability.findOne({
      _id: slotId,
      tutor: tutorId,
    });

    if (!slot) {
      throw new Error("Slot not found or you are not authorized.");
    }

    if (slot.status === "booked") {
      throw new Error("Cannot delete a booked slot. Cancel the session first.");
    }

    await Availability.deleteOne({ _id: slotId });

    return { message: "Slot deleted successfully." };
  }

  async blockSlot(slotId, tutorId) {
    const slot = await Availability.findOne({
      _id: slotId,
      tutor: tutorId,
      status: "available",
    });

    if (!slot) {
      throw new Error("Slot not found or not available.");
    }

    slot.status = "blocked";
    await slot.save();

    return { message: "Slot blocked successfully.", slot };
  }

  async unblockSlot(slotId, tutorId) {
    const slot = await Availability.findOne({
      _id: slotId,
      tutor: tutorId,
      status: "blocked",
    });

    if (!slot) {
      throw new Error("Slot not found or not blocked.");
    }

    slot.status = "available";
    await slot.save();

    return { message: "Slot unblocked successfully.", slot };
  }

  async getTutorSlotStats(tutorId) {
    const totalSlots = await Availability.countDocuments({ tutor: tutorId });
    const availableSlots = await Availability.countDocuments({
      tutor: tutorId,
      status: "available",
    });
    const bookedSlots = await Availability.countDocuments({
      tutor: tutorId,
      status: "booked",
    });
    const blockedSlots = await Availability.countDocuments({
      tutor: tutorId,
      status: "blocked",
    });

    const utilizationRate = totalSlots > 0 ? Number(((bookedSlots / totalSlots) * 100).toFixed(1)) : 0;

    return {
      totalSlots,
      availableSlots,
      bookedSlots,
      blockedSlots,
      utilizationRate,
    };
  }

  async checkTimeConflict(tutorId, date, startTime, endTime, excludeSlotId = null) {
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    const query = {
      tutor: tutorId,
      date: slotDate,
      status: "available",
    };

    if (excludeSlotId) {
      query._id = { $ne: excludeSlotId };
    }

    const conflictingSlots = await Availability.find(query);

    for (const slot of conflictingSlots) {
      const newStart = this.timeToMinutes(startTime);
      const newEnd = this.timeToMinutes(endTime);
      const existingStart = this.timeToMinutes(slot.startTime);
      const existingEnd = this.timeToMinutes(slot.endTime);

      if (newStart < existingEnd && newEnd > existingStart) {
        return true;
      }
    }

    return false;
  }

  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }
}

module.exports = new AvailabilityService();
