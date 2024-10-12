"use client";

import * as React from "react";
import { Input } from "../components/ui/input"; 
import { Label } from "../components/ui/label"; 
import { DayPicker } from "react-day-picker";
import dayjs from "dayjs";
import 'react-day-picker/dist/style.css'; // Import react-day-picker styles

const MissedFastsInput = () => {
  const [missedFasts, setMissedFasts] = React.useState<number>(0);
  const [firstDay, setFirstDay] = React.useState<Date | null>(null);
  const [cycleLength, setCycleLength] = React.useState<number>(28);
  const [menstruationDuration, setMenstruationDuration] = React.useState<number>(7);
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
    setFirstDay(date ?? null);
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

  // Calculate available days that do not overlap with menstruation days and are in the future
  const calculateAvailableDays = (): Date[] => {
    if (!firstDay || missedFasts === 0) return [];

    const availableDays: Date[] = [];
    const menstruationDays = calculateMenstruationDays();

    // Get tomorrow's date
    const tomorrow = dayjs().add(1, 'day');

    // Start from the first day and try to find 'missedFasts' number of available days
    let currentDay = dayjs(firstDay).isBefore(tomorrow) ? tomorrow : dayjs(firstDay);
    let addedFasts = 0;

    while (addedFasts < missedFasts) {
      const isMenstruationDay = menstruationDays.some(mDay =>
        dayjs(mDay).isSame(currentDay, 'day')
      );

      if (!isMenstruationDay) {
        availableDays.push(currentDay.toDate());
        addedFasts++;
      }

      currentDay = currentDay.add(1, 'day');
    }

    return availableDays;
  };

  const availableDays = React.useMemo(() => {
    if (missedFasts === 0 || !firstDay) {
      return [];
    }
    return calculateAvailableDays();
  }, [firstDay, missedFasts, cycleLength, menstruationDuration]);

  const customDayContent = (day: Date) => {
    const isHighlighted = availableDays.some(availableDay =>
      dayjs(availableDay).isSame(day, 'day')
    );

    return isHighlighted ? (
      <div style={{ backgroundColor: "lightpink", borderRadius: "2px", padding: "2px", textAlign: 'center' }}>
        Available
      </div>
    ) : null;
  };

  return (
    <div className="relative min-h-screen backdrop-blur-sm bg-[url('background.png.png')] bg-cover bg-center bg-fixed">
     
      <h1 className="text-4xl font-bold text-center pt-10">Missed Fasts</h1>

      <div className="flex flex-col items-center text-center p-4">
        <Label className="block mb-2">How many days do you need to make up?</Label>
        <Input
          type="number"
          min="1"
          max="100"
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
            highlighted: availableDays,
          }}
          modifiersStyles={{
            highlighted: { backgroundColor: 'lightpink', color: 'white' },
          }}
        />

        {error && <div className="text-red-500 mb-4">{error}</div>}
      </div>
    </div>
  );
};

export default MissedFastsInput;
