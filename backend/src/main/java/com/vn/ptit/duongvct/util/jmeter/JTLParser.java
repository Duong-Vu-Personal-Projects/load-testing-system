package com.vn.ptit.duongvct.util.jmeter;


import com.vn.ptit.duongvct.dto.response.testplan.TestResultRecord;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

public class JTLParser {

    public static ArrayList<TestResultRecord> parseJtlFile(String filePath) throws IOException {
        CSVFormat csvFormat = CSVFormat.Builder.create().setIgnoreHeaderCase(true).setHeader().setSkipHeaderRecord(true).get();
        Path path = Paths.get(filePath);
        CSVParser csvParser = CSVParser.parse(path, StandardCharsets.UTF_8, csvFormat);
        ArrayList<TestResultRecord> records = new ArrayList<>();
        for(CSVRecord csvRecord : csvParser) {
            TestResultRecord record = new TestResultRecord();
            record.setTimeStamp(Long.parseLong(csvRecord.get("timeStamp")));
            record.setElapsed(Long.parseLong(csvRecord.get("elapsed")));
            record.setLabel(csvRecord.get("label"));
            record.setResponseCode(Integer.parseInt(csvRecord.get("responseCode")));
            record.setResponseMessage(csvRecord.get("responseMessage"));
            record.setThreadName(csvRecord.get("threadName"));
            record.setDataType(csvRecord.get("dataType"));
            record.setSuccess(Boolean.parseBoolean(csvRecord.get("success")));
            record.setFailureMessage(csvRecord.get("failureMessage"));
            record.setBytes(Long.parseLong(csvRecord.get("bytes")));
            record.setSentBytes(Long.parseLong(csvRecord.get("sentBytes")));
            record.setGrpThreads(Integer.parseInt(csvRecord.get("grpThreads")));
            record.setAllThreads(Integer.parseInt(csvRecord.get("allThreads")));
            record.setURL(csvRecord.get("URL"));
            record.setLatency(Long.parseLong(csvRecord.get("Latency")));
            record.setIdleTime(Long.parseLong(csvRecord.get("IdleTime")));
            record.setConnect(Long.parseLong(csvRecord.get("Connect")));

            records.add(record);
        }
        return records;
    }
}
