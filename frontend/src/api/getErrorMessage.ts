import {isAxiosError} from "axios";

/** Both backends answer errors as { status, error, message, path }. */
export const getErrorMessage = (error: unknown, fallback = "Something went wrong, please try again"): string => {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (typeof message === "string" && message) return message;
        if (!error.response) return "Cannot reach the server";
    }
    return fallback;
};
