import { Link } from "react-router-dom";

function Button({
    text,
    to,
    variant="primary"
}){

    const baseStyle =
        "px-6 py-3 rounded-lg font-semibold transition duration-300";

    const variants ={

        primary:
            "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
            "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",

    };

    return(

        <Link
            to={to}
            className={`${baseStyle} ${variants[variant]}`}
        >
            {text}
        </Link>

    );
}

export default Button;