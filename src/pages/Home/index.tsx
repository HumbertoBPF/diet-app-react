import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pad } from 'utils/number';

function Home() {
    const [date, setDate] = useState<Dayjs | null>(dayjs());

    const navigate = useNavigate();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                value={date}
                onChange={(value) => {
                    navigate(
                        `/diet/${pad(value.year())}-${pad(value.month() + 1)}-${pad(value.date())}`
                    );
                    setDate(value);
                }}
                slotProps={{
                    day: {
                        // @ts-expect-error error due to data-testid
                        'data-testid': 'day-button',
                    },
                }}
            />
        </LocalizationProvider>
    );
}

export default Home;
