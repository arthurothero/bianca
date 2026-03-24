package com.bianca.backend.service;

import com.bianca.backend.entity.MemoriaEntity;
import com.bianca.backend.repository.MemoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class MemoriaService {

    private final MemoriaRepository memoriaRepository;

    public MemoriaService(MemoriaRepository memoriaRepository) {
        this.memoriaRepository = memoriaRepository;
    }

    public MemoriaEntity salvar(String titulo, String subtitulo, String descricao, MultipartFile imagem) throws Exception {
        String caminho = "uploads/";
        String nomeArquivo = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();

        Path path = Paths.get(caminho + nomeArquivo);
        Files.createDirectories(path.getParent());
        Files.write(path, imagem.getBytes());

        MemoriaEntity memoria = new MemoriaEntity();
        memoria.setTitulo(titulo);
        memoria.setSubtitulo(subtitulo);
        memoria.setDescricao(descricao);
        memoria.setImagemUrl("http://localhost:8080/uploads/" + nomeArquivo);

        return memoriaRepository.save(memoria);
    }

    public List<MemoriaEntity> listar() {
        return memoriaRepository.findAll();
    }
}