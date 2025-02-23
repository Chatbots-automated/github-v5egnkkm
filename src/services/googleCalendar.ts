import { google } from 'googleapis';
import { oauth2Client } from './googleAuth';

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const CALENDAR_ID = '6b15306aca13f2f311f3994866b7492d616027788e6ad9ff2fac90fab57ecfd1@group.calendar.google.com';

export const checkAvailability = async (startTime: string, endTime: string): Promise<boolean> => {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items?.length === 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
};

export const createBooking = async (booking: {
  summary: string;
  description: string;
  start: string;
  end: string;
}): Promise<string> => {
  try {
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        summary: booking.summary,
        description: booking.description,
        start: {
          dateTime: booking.start,
          timeZone: 'Europe/Vilnius',
        },
        end: {
          dateTime: booking.end,
          timeZone: 'Europe/Vilnius',
        },
      },
    });

    return response.data.id || '';
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (eventId: string): Promise<void> => {
  try {
    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: eventId,
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};