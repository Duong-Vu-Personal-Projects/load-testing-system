package com.vn.ptit.duongvct.util;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultRecord;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;

public class JTLParser {

    public static ArrayList<TestResultRecord> parseJtlFile(String filePath) throws IOException {
        CSVFormat csvFormat = CSVFormat.Builder.create().setIgnoreHeaderCase(true).setHeader().setSkipHeaderRecord(true).get();
        Path path = Paths.get(filePath);
        CSVParser csvParser = CSVParser.parse(path, StandardCharsets.UTF_8, csvFormat);
        ArrayList<TestResultRecord> records = new ArrayList<>();
        // Get first timestamp for relative time calculations
        long firstTimestamp = -1;

        // First parse all records
        for(CSVRecord csvRecord : csvParser) {
            TestResultRecord record = new TestResultRecord();

            // Parse the timestamp and track the first one we see
            long timestamp = Long.parseLong(csvRecord.get("timeStamp"));
            if (firstTimestamp == -1 || timestamp < firstTimestamp) {
                firstTimestamp = timestamp;
            }

            record.setTimeStamp(timestamp);
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

        // Now process all records to add relative time and readable time
        for (TestResultRecord record : records) {
            // Calculate seconds since test start (for graphing)
            double relativeTimeSeconds = (record.getTimeStamp() - firstTimestamp) / 1000.0;
            record.setRelativeTime(relativeTimeSeconds);

            // Format readable time as duration since start (HH:MM:SS.sss)
            long millisSinceStart = record.getTimeStamp() - firstTimestamp;
            Duration duration = Duration.ofMillis(millisSinceStart);
            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();
            long seconds = duration.toSecondsPart();
            long millis = duration.toMillisPart();

            // Format as 0:00:00.000
            String readableTime = String.format("%d:%02d:%02d.%03d",
                    hours, minutes, seconds, millis);
            record.setReadableTime(readableTime);
        }

        // Sort records by timestamp (ascending)
        records.sort(Comparator.comparing(TestResultRecord::getTimeStamp));

        return records;
    }
}