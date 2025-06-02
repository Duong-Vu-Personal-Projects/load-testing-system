package com.vn.ptit.duongvct.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.elasticsearch.config.ElasticsearchConfigurationSupport;
import org.springframework.data.elasticsearch.core.convert.ElasticsearchCustomConversions;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;

@Configuration
public class ElasticsearchConverterConfig extends ElasticsearchConfigurationSupport {

    @Bean
    @Override
    public ElasticsearchCustomConversions elasticsearchCustomConversions() {
        return new ElasticsearchCustomConversions(Arrays.asList(
                new LocalDateTimeToLongConverter(),
                new LongToLocalDateTimeConverter()
        ));
    }

    @WritingConverter
    static class LocalDateTimeToLongConverter implements Converter<LocalDateTime, Long> {
        @Override
        public Long convert(LocalDateTime source) {
            if (source == null) {
                return null;
            }
            return source.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        }
    }

    @ReadingConverter
    static class LongToLocalDateTimeConverter implements Converter<Long, LocalDateTime> {
        @Override
        public LocalDateTime convert(Long source) {
            if (source == null) {
                return null;
            }
            return LocalDateTime.ofInstant(Instant.ofEpochMilli(source), ZoneId.systemDefault());
        }
    }
}