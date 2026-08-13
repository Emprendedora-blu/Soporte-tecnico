package com.empresa.soportetecnico.common;

public class ApiResponseUtil {

    private ApiResponseUtil() {}

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(ResponseCode.SUCCESS, message, data);
    }

    public static <T> ApiResponse<T> notFound(String message) {
        return new ApiResponse<>(ResponseCode.NOT_FOUND, message, null);
    }

    public static <T> ApiResponse<T> badRequest(String message) {
        return new ApiResponse<>(ResponseCode.BAD_REQUEST, message, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(ResponseCode.ERROR, message, null);
    }
}
