package com.vn.ptit.duongvct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.groovy.template.GroovyTemplateAutoConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = { GroovyTemplateAutoConfiguration.class }, proxyBeanMethods = false)
@EnableMongoRepositories(basePackages = "com.vn.ptit.duongvct.repository.mongo")
@EnableElasticsearchRepositories(basePackages = "com.vn.ptit.duongvct.repository.search")
@EnableScheduling
@EnableMongoAuditing
public class LoadTestingApplication {

	public static void main(String[] args) {
//		System.setProperty("java.awt.headless", "false");
		SpringApplication.run(LoadTestingApplication.class, args);
	}

}
