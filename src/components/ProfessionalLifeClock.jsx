'use client'

import React, { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ProfessionalLifeClock() {
    const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' })
    const [timeElapsed, setTimeElapsed] = useState(null)
    const [isRunning, setIsRunning] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                calculateTime()
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isRunning, birthDate])

    const calculateTime = () => {
        const { year, month, day } = birthDate
        if (!year || !month || !day) return

        const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        const now = new Date()

        if (birth > now) {
            setError('Birth date cannot be in the future')
            setIsRunning(false)
            return
        }

        const diff = now.getTime() - birth.getTime()
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44))
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24))
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const seconds = now.getSeconds()
        const milliseconds = now.getMilliseconds()

        setTimeElapsed({ years, months, days, hours, minutes, seconds, milliseconds })
        setError('')
    }

    const handleInputChange = (e) => {
        setBirthDate({ ...birthDate, [e.target.name]: e.target.value })
    }

    const handleStart = () => {
        if (birthDate.year && birthDate.month && birthDate.day) {
            setIsRunning(true)
        } else {
            setError('Please enter a valid date')
        }
    }

    const handleReset = () => {
        setIsRunning(false)
        setTimeElapsed(null)
        setBirthDate({ year: '', month: '', day: '' })
        setError('')
    }

    const formatNumber = (num) => num.toString().padStart(2, '0')

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <Card className="w-full max-w-md overflow-hidden">
                <CardHeader className="space-y-1">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-light">Life Clock</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <Switch
                                checked={isDarkMode}
                                onCheckedChange={setIsDarkMode}
                                aria-label="Toggle dark mode"
                            />
                            <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year" className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    name="year"
                                    placeholder="YYYY"
                                    value={birthDate.year}
                                    onChange={handleInputChange}
                                    min="1900"
                                    max="2099"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="month" className="text-sm font-medium text-gray-700 dark:text-gray-300">Month</Label>
                                <Input
                                    id="month"
                                    type="number"
                                    name="month"
                                    placeholder="MM"
                                    value={birthDate.month}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="12"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="day" className="text-sm font-medium text-gray-700 dark:text-gray-300">Day</Label>
                                <Input
                                    id="day"
                                    type="number"
                                    name="day"
                                    placeholder="DD"
                                    value={birthDate.day}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="31"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <div className="flex justify-between space-x-4">
                            <Button onClick={handleStart} disabled={isRunning} className="flex-1 transition-all duration-300">
                                {isRunning ? 'Clock Running' : 'Start Clock'}
                            </Button>
                            <Button variant="outline" onClick={handleReset} className="flex-1 transition-all duration-300">
                                Reset
                            </Button>
                        </div>
                    </form>
                    {timeElapsed && (
                        <div className="mt-6 space-y-4 text-center animate-fade-in">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Time elapsed since your birth:</p>
                            <div className="text-4xl opacity-70 tracking-tight text-primary">
                                {formatNumber(timeElapsed.years)}:{formatNumber(timeElapsed.months)}:{formatNumber(timeElapsed.days)}
                            </div>
                            <div className="text-2xl opacity-50 tracking-tight text-primary">
                                {formatNumber(timeElapsed.hours)}:{formatNumber(timeElapsed.minutes)}:{formatNumber(timeElapsed.seconds)}:{formatNumber(timeElapsed.milliseconds)}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>
                                    <p className="font-medium">Years</p>
                                    <p>{timeElapsed.years}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Months</p>
                                    <p>{timeElapsed.months}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Days</p>
                                    <p>{timeElapsed.days}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
