import { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
    createMemoryRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';
import { AppStore, RootState, setupStore } from 'app/store';
import { ThemeProvider } from '@mui/material';
import theme from 'theme';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    initialEntries?: string[];
    store?: AppStore;
}

export function renderWithProviders(
    ui: ReactElement,
    extendedRenderOptions: ExtendedRenderOptions = {}
) {
    const {
        preloadedState = {},
        initialEntries = [],
        store = setupStore(preloadedState),
        ...renderOptions
    } = extendedRenderOptions;

    const Wrapper = ({ children }: PropsWithChildren) => {
        const router = createMemoryRouter(createRoutesFromElements(children), {
            initialEntries,
        });

        return (
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </Provider>
        );
    };

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}
