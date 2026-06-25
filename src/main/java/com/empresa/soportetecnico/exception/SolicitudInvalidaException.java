package com.empresa.soportetecnico.exception;

/*
 Excepcion lanzada cuando una solicitud incumple una regla de negocio,
 por ejemplo un valor de prioridad o estado que no corresponde a los
 valores permitidos por los enums del dominio.
 */
public class SolicitudInvalidaException extends RuntimeException {

    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
    }
}
