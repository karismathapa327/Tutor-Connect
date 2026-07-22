import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/dashboard/PageHeader";
import EmptyState from "../../components/dashboard/EmptyState";
import RequestCard from "../../components/tutor/RequestCard";
import { TableSkeleton } from "../../components/common/Skeleton";

import { MessageSquare } from "lucide-react";

import {
  getTutorRequests,
  updateRequestStatus,
} from "../../api/tutorApi";

function TutorRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {

    try {

      const data = await getTutorRequests();

      setRequests(data.requests);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load requests.");

    } finally {

      setLoading(false);

    }

  };

  const handleStatusUpdate = async (
    requestId,
    status
  ) => {

    try {

      const data = await updateRequestStatus(
        requestId,
        status
      );

      toast.success(data.message);

      fetchRequests();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );

    }

  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tutoring Requests" subtitle="Accept or reject incoming tutoring requests." />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (

    <div className="space-y-8">

      <PageHeader
        title="Tutoring Requests"
        subtitle="Accept or reject incoming tutoring requests."
      />

      {requests.length === 0 ? (

        <EmptyState
          icon={MessageSquare}
          title="No Requests"
          description="Students haven't sent any tutoring requests yet."
        />

      ) : (

        <div className="grid gap-6">

          {requests.map((request) => (

            <RequestCard
              key={request._id}
              request={request}
              onAccept={(id) =>
                handleStatusUpdate(id, "Accepted")
              }
              onReject={(id) =>
                handleStatusUpdate(id, "Rejected")
              }
            />

          ))}

        </div>

      )}

    </div>

  );

}

export default TutorRequests;