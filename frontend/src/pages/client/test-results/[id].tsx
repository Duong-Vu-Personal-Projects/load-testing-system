import React from 'react';
import TestReportDashboard from '../../components/client/load-testing/TestReportDashboard';

const TestResultPage: React.FC = () => {
  const testData = {}; // Assuming testData is obtained or calculated somewhere

  return (
    <div>
      {/* ...other UI... */}
      <TestReportDashboard testData={testData} />
      {/* ...other UI... */}
    </div>
  );
};

export default TestResultPage;