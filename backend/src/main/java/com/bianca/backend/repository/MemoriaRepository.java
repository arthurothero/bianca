package com.bianca.backend.repository;

import com.bianca.backend.entity.MemoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoriaRepository extends JpaRepository<MemoriaEntity, Integer> {
}