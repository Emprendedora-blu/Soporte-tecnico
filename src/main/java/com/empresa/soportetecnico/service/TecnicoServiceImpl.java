package com.empresa.soportetecnico.service;

import com.empresa.soportetecnico.exception.RecursoNoEncontradoException;
import com.empresa.soportetecnico.model.Tecnico;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Implementacion de TecnicoService que simula la persistencia utilizando
 * un Map en memoria.
 */
@Service
public class TecnicoServiceImpl implements TecnicoService {

    private final Map<Long, Tecnico> tecnicos = new ConcurrentHashMap<>();
    private final AtomicLong contadorId = new AtomicLong(0);

    @Override
    public List<Tecnico> listarTodos() {
        return List.copyOf(tecnicos.values());
    }

    @Override
    public Tecnico buscarPorId(Long id) {
        Tecnico tecnico = tecnicos.get(id);
        if (tecnico == null) {
            throw new RecursoNoEncontradoException("No se encontro un tecnico con id " + id);
        }
        return tecnico;
    }

    @Override
    public Tecnico crear(Tecnico tecnico) {
        Long nuevoId = contadorId.incrementAndGet();
        tecnico.setId(nuevoId);
        tecnicos.put(nuevoId, tecnico);
        return tecnico;
    }

    @Override
    public Tecnico actualizar(Long id, Tecnico tecnicoActualizado) {
        Tecnico tecnicoExistente = buscarPorId(id);

        tecnicoExistente.setNombre(tecnicoActualizado.getNombre());
        tecnicoExistente.setCorreo(tecnicoActualizado.getCorreo());
        tecnicoExistente.setEspecialidad(tecnicoActualizado.getEspecialidad());

        tecnicos.put(id, tecnicoExistente);
        return tecnicoExistente;
    }

    @Override
    public void eliminar(Long id) {
        buscarPorId(id);
        tecnicos.remove(id);
    }
}
