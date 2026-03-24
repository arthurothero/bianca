package com.bianca.backend.controller;

import com.bianca.backend.entity.MemoriaEntity;
import com.bianca.backend.service.MemoriaService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/memorias")
@CrossOrigin(origins = "*")
public class MemoriaController {

    private final MemoriaService memoriaService;

    public MemoriaController(MemoriaService memoriaService) {
        this.memoriaService = memoriaService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MemoriaEntity salvar(
            @RequestParam("titulo") String titulo,
            @RequestParam("subtitulo") String subtitulo,
            @RequestParam("descricao") String descricao,
            @RequestParam("imagem") MultipartFile imagem
    ) throws Exception {
        return memoriaService.salvar(titulo, subtitulo, descricao, imagem);
    }

    @GetMapping
    public List<MemoriaEntity> listar() {
        return memoriaService.listar();
    }
}