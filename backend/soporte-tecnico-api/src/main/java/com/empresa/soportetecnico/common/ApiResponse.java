package com.empresa.soportetecnico.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Schema(description = "Respuesta estandar de la API")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    @Schema(description = "Codigo de respuesta", example = "SUCCESS")
    private String responseCode;

    @Schema(description = "Mensaje de respuesta", example = "Operacion realizada exitosamente")
    private String responseMessage;

    @Schema(description = "Datos de la respuesta")
    private T data;

    @Schema(description = "Fecha y hora de la respuesta")
    private LocalDateTime timestamp;

    public ApiResponse(String responseCode, String responseMessage, T data) {
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
        this.data = data;
        this.timestamp = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }

    public String getResponseCode() { return responseCode; }
    public void setResponseCode(String responseCode) { this.responseCode = responseCode; }

    public String getResponseMessage() { return responseMessage; }
    public void setResponseMessage(String responseMessage) { this.responseMessage = responseMessage; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
