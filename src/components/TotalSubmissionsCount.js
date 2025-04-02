import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const TotalSubmissionsCount = () => {
  const [count, setCount] = useState(2318); // Default value until real count is fetched

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count: totalCount } = await supabase
          .from('salary_submissions')
          .select('*', { count: 'exact', head: true });
        
        if (totalCount) {
          setCount(totalCount);
        }
      } catch (error) {
        console.error('Error fetching total submissions:', error);
      }
    };

    fetchCount();
  }, []);

  return count.toLocaleString();
};

export default TotalSubmissionsCount; 