import dayjs from 'dayjs';

export interface ChartData {
  responseTimeChart: any;
  throughputChart: any;
  latencyDistributionChart: any;
  connectTimeChart: any;
}

export const processChartData = (records: any[]): ChartData => {
  // For throughput calculation
  const throughputMap = new Map();
  const timeFormat = 1000; // Round to nearest second
  
  // Create response time distribution buckets
  const latencyBuckets: Record<string, number> = {
    "0-500ms": 0,
    "500-1000ms": 0,
    "1-2s": 0,
    "2-5s": 0,
    "5s+": 0
  };
  
  // Process all records
  records.forEach((record: any) => {
    // Round timestamp to nearest second for throughput
    const roundedTime = Math.floor(record.timeStamp / timeFormat) * timeFormat;
    if (!throughputMap.has(roundedTime)) {
      throughputMap.set(roundedTime, 0);
    }
    throughputMap.set(roundedTime, throughputMap.get(roundedTime) + 1);
    
    // Count latency distribution
    const elapsed = record.elapsed;
    if (elapsed < 500) latencyBuckets["0-500ms"]++;
    else if (elapsed < 1000) latencyBuckets["500-1000ms"]++;
    else if (elapsed < 2000) latencyBuckets["1-2s"]++;
    else if (elapsed < 5000) latencyBuckets["2-5s"]++;
    else latencyBuckets["5s+"]++;
  });
  
  // Response Time Chart
  const responseTimeChart = {
    labels: records.slice(0, 100).map((_: any, index: number) => index + 1),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: records.slice(0, 100).map((record: any) => record.elapsed),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.5)',
        tension: 0.1
      }
    ]
  };
  
  // Throughput Chart
  const throughputLabels = Array.from(throughputMap.keys()).map(timestamp => 
    dayjs(timestamp).format('HH:mm:ss')
  );
  const throughputValues = Array.from(throughputMap.values());
  
  const throughputChart = {
    labels: throughputLabels,
    datasets: [
      {
        label: 'Requests per Second',
        data: throughputValues,
        backgroundColor: 'rgba(24, 144, 255, 0.7)',
      }
    ]
  };
  
  // Latency Distribution Chart
  const latencyDistributionChart = {
    labels: Object.keys(latencyBuckets),
    datasets: [
      {
        data: Object.values(latencyBuckets),
        backgroundColor: [
          '#52c41a', // Green
          '#1890ff', // Blue
          '#faad14', // Yellow
          '#fa8c16', // Orange
          '#f5222d', // Red
        ],
        borderWidth: 1,
      }
    ]
  };
  
  // Connect Time Chart
  const connectTimeChart = {
    labels: records.slice(0, 100).map((_: any, index: number) => index + 1),
    datasets: [
      {
        label: 'Connect Time (ms)',
        data: records.slice(0, 100).map((record: any) => record.connect),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.5)',
        tension: 0.1
      }
    ]
  };
  
  return {
    responseTimeChart,
    throughputChart,
    latencyDistributionChart,
    connectTimeChart
  };
};

// Chart options
export const chartOptions = {
  line: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  },
  bar: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  },
  pie: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    }
  }
};

// Helper functions
export const calculateSuccessRate = (records: any[]): number => {
  return records.length > 0 
    ? (records.filter((r: any) => r.success).length / records.length) * 100 
    : 100;
};

export const calculateAvgResponseTime = (records: any[]): number => {
  return records.length > 0
    ? records.reduce((sum: number, record: any) => sum + record.elapsed, 0) / records.length
    : 0;
};