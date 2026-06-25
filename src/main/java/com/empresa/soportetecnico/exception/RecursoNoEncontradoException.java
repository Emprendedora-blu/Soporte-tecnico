package com.empresa.soportetecnico.exception;

/*
 Excepcion lanzada cuando se busca un recurso (Solicitud, Cliente o
 Tecnico) por su id y este no existe en el almacenamiento en memoria.
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
