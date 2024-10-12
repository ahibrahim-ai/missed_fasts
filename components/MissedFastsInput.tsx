"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "../components/ui/input"; 
import { Label } from "../components/ui/label"; 
import { Button } from "../components/ui/button"; 
import { DayPicker } from "react-day-picker";
import dayjs from "dayjs";
import 'react-day-picker/dist/style.css'; // Import react-day-picker styles

const MissedFastsInput = () => {
  const [missedFasts, setMissedFasts] = React.useState<number>(0);
  const [firstDay, setFirstDay] = React.useState<Date>(new Date());
  const [cycleLength, setCycleLength] = React.useState<number>(28);
  const [menstruationDuration, setMenstruationDuration] = React.useState<number>(7);
  const [selectedToggle, setSelectedToggle] = useState<string | null>(null); // Selected fasting pattern
  const [error, setError] = React.useState<string>("");

  // Handler for the missed fasts input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1 && value <= 100) {
      setMissedFasts(value);
      setError("");
    } else {
      setError("Please input a valid number of missed fasts.");
    }
  };

  // Handle first day of last menstrual cycle change
  const handleFirstDayChange = (date: Date | undefined) => {
    setFirstDay(date ?? new Date());
    setError("");
  };

  // Handle cycle length change
  const handleCycleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setCycleLength(value >= 1 ? value : cycleLength);
  };

  // Handle menstruation duration change
  const handleMenstruationDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setMenstruationDuration(value >= 1 ? value : menstruationDuration);
  };

  // Calculate menstruation days for each cycle
  const calculateMenstruationDays = (): Date[] => {
    if (!firstDay || missedFasts === 0) return [];

    const menstruationDays: Date[] = [];
    let currentCycleStart = dayjs(firstDay);

    // Calculate menstruation days for the given number of cycles
    for (let i = 0; i < Math.ceil(missedFasts / cycleLength); i++) {
      for (let j = 0; j < menstruationDuration; j++) {
        menstruationDays.push(currentCycleStart.add(j, 'day').toDate());
      }
      currentCycleStart = currentCycleStart.add(cycleLength, 'day');
    }

    return menstruationDays;
  };

  const calculateHighlightedDays = React.useMemo(() => {
    if (!firstDay || missedFasts === 0) return [];

    let highlightedDays: Date[] = [];
    const today = new Date();

    if (selectedToggle === 'MonThu') {
      // Highlight Monday and Thursday
      let count = 0;
      let nextDate = new Date(today);
      while (count < missedFasts) {
        while (nextDate.getDay() !== 1 && nextDate.getDay() !== 4) {
          nextDate.setDate(nextDate.getDate() + 1); // Advance to Monday or Thursday
        }
        highlightedDays.push(new Date(nextDate));
        nextDate.setDate(nextDate.getDate() + 1); // Move to the next day to continue
        count++;
      }
    } else if (selectedToggle === 'EveryOther') {
      // Highlight every other day
      for (let i = 0; i < missedFasts; i++) {
        let nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i * 2); // Every other day
        highlightedDays.push(nextDate);
      }
    } else if (selectedToggle === 'Consecutively') {
      // Highlight consecutive days
      for (let i = 0; i < missedFasts; i++) {
        let nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i); // Consecutive days
        highlightedDays.push(nextDate);
      }
    }

    return highlightedDays;
  }, [selectedToggle, missedFasts, firstDay]);

  return (
    <div className="relative min-h-screen backdrop-blur-sm bg-[url('background.png.png')] bg-cover bg-center bg-fixed">
     
      <h1 className="text-4xl font-bold text-center pt-10">Missed Fasts</h1>

      <div className="flex flex-col items-center text-center p-4">
        <Label className="block mb-2">How many days do you need to make up?</Label>
        <Input
          type="number"
          min="1"
          value={missedFasts || ''}
          onChange={handleInputChange}
          className="border rounded-2xl p-2 text-center mb-4"
        />
        <Label className="block mb-2">Normal length of cycle (in days):</Label>
        <Input
          type="number"
          min="1"
          value={cycleLength}
          onChange={handleCycleLengthChange}
          className="border rounded-2xl p-2 text-center mb-4"
        />

        <Label className="block mb-2">Usual menstruation duration (in days):</Label>
        <Input
          type="number"
          min="1"
          value={menstruationDuration}
          onChange={handleMenstruationDurationChange}
          className="border rounded-2xl p-2 text-center mb-4"
        />
        <Label className="block mb-2">First day of last menstrual cycle:</Label>
        <DayPicker 
          mode="single"
          selected={firstDay}
          onSelect={handleFirstDayChange}
          modifiers={{
            highlighted: calculateHighlightedDays, // Use the highlighted days based on toggle
          }}
          modifiersStyles={{
            highlighted: { backgroundColor: 'lightpink', color: 'white' },
          }}
        />
        <div className="relative flex flex-row max-w-screen-sm space-x-5 justify-center mt-16">
          <Button
            variant={selectedToggle === 'MonThu' ? 'solid' : 'outline'}
            onClick={() => setSelectedToggle('MonThu')}
            className='w-24'
          >
            Mon + Thu
          </Button>
          <Button
            variant={selectedToggle === 'EveryOther' ? 'solid' : 'outline'}
            onClick={() => setSelectedToggle('EveryOther')}
            className='w-32'
          >
            Every other day
          </Button>
          <Button
            variant={selectedToggle === 'Consecutively' ? 'solid' : 'outline'}
            onClick={() => setSelectedToggle('Consecutively')}
            className='w-24'
          >
            Daily
          </Button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
      </div>
    </div>
  );
};

export default MissedFastsInput;
