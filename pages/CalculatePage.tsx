import dayjs from 'dayjs';
import React from 'react';

const CalculatePage = () => {
  // Approximate Ramadan start for 2024
  const nextRamadan = dayjs('2024-03-10'); // Adjust this date each year
  const today = dayjs();
  const daysUntilNextRamadan = nextRamadan.diff(today, 'day');

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Days Until Next Ramadan</h1>
      <p className="text-xl mt-4">{daysUntilNextRamadan} days left</p>
    </div>
  );
};

export default CalculatePage;
