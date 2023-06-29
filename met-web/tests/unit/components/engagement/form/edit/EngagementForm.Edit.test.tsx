import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../../../src/components/engagement/form';
import { setupEnv } from '../../../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as engagementSlugService from 'services/engagementSlugService';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import * as widgetService from 'services/widgetService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { WidgetType } from 'models/widget';
import { Box } from '@mui/material';
import { draftEngagement, engagementMetadata, engagementSlugData } from '../../../factory';
import { SCOPES } from 'components/permissionsGate/PermissionMaps';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [SCOPES.VIEW_PRIVATE_ENGAGEMENTS, SCOPES.EDIT_ENGAGEMENT, SCOPES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        };
    }),
}));

jest.mock('components/common/Dragdrop', () => ({
    ...jest.requireActual('components/common/Dragdrop'),
    MetDroppable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
    MetDraggable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@hello-pangea/dnd', () => ({
    ...jest.requireActual('@hello-pangea/dnd'),
    DragDropContext: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

jest.mock('components/map', () => () => {
    return <Box></Box>;
});

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

// Mocking window.location.pathname in Jest
Object.defineProperty(window, 'location', {
    value: {
        pathname: '/engagements/1/form',
    },
});

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const openNotificationModalMock = jest
        .spyOn(notificationModalSlice, 'openNotificationModal')
        .mockImplementation(jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMetadataMock = jest
        .spyOn(engagementMetadataService, 'getEngagementMetadata')
        .mockReturnValue(Promise.resolve(engagementMetadata));
    jest.spyOn(engagementMetadataService, 'patchEngagementMetadata').mockReturnValue(
        Promise.resolve(engagementMetadata),
    );
    const getEngagementSlugMock = jest
        .spyOn(engagementSlugService, 'getSlugByEngagementId')
        .mockReturnValue(Promise.resolve(engagementSlugData));
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const patchEngagementMock = jest
        .spyOn(engagementService, 'patchEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([]));

    beforeEach(() => {
        setupEnv();
    });

    test('Engagement form with saved engagement should display saved info', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(getEngagementMetadataMock).toHaveBeenCalledOnce();
        expect(screen.getByTestId('update-engagement-button')).toBeVisible();
        expect(screen.getByDisplayValue('2022-09-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-30')).toBeInTheDocument();
        expect(screen.getByText('Survey 1')).toBeInTheDocument();
    });

    test('Save engagement button should trigger Put call', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });
        const updateButton = screen.getByTestId('update-engagement-button');

        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(patchEngagementMock).toHaveBeenCalledOnce();
        });
    });

    test('Modal with warning appears when removing survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const removeSurveyButton = screen.getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        expect(openNotificationModalMock).toHaveBeenCalledOnce();
    });

    test('Cannot add more than one survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        getEngagementMetadataMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagementMetadata,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Add Survey')).toBeDisabled();
    });

    test.only('Can move to settings tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const settingsTabButton = screen.getByText('Settings');

        fireEvent.click(settingsTabButton);

        expect(screen.getByText('Engagement Link')).toBeInTheDocument();
        await waitFor(() => {
            expect(getEngagementSlugMock).toHaveReturned();
            expect(screen.getByDisplayValue(engagementSlugData.slug, { exact: false })).toBeInTheDocument();
        });
    });

    test('Remove survey triggers notification modal', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );

        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: [],
            }),
        );

        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Survey 1')).toBeInTheDocument();

        const removeSurveyButton = screen.getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        await waitFor(() => {
            expect(openNotificationModalMock).toHaveBeenCalledOnce();
        });
    });

    test('Widget block appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Add Widget')).toBeVisible();
        expect(getWidgetsMock).toHaveBeenCalled();
    });

    test('Widget drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const addWidgetButton = screen.getByText('Add Widget');
        fireEvent.click(addWidgetButton);

        await waitFor(() => {
            expect(screen.getByText('Select Widget')).toBeVisible();
            expect(screen.getByTestId(`widget-drawer-option/${WidgetType.WhoIsListening}`));
            expect(screen.getByTestId(`widget-drawer-option/${WidgetType.Phases}`));
        });
    });

    test('Day Calculator Modal appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, container, getByText } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            expect(getByTestId('daycalculator-title')).toBeVisible();
            expect(getByTestId('reset-button')).toBeVisible();
            expect(getByTestId('cancel-button')).toBeVisible();
            expect(getByTestId('calculator-button')).toBeVisible();
            expect(getByText('Calculation Type')).toBeInTheDocument();
            expect(getByText('Number of Days')).toBeInTheDocument();
            const autocomplete = getByTestId('autocomplete');
            const input: HTMLInputElement = within(autocomplete).getByLabelText('Day Zero') as HTMLInputElement;
            expect(input).not.toBeNull();
            const suspensiondate = screen.queryByText('Suspension Date');
            expect(suspensiondate).toBeNull();
            const ruspensiondate = screen.queryByText('Resumption Date');
            expect(ruspensiondate).toBeNull();
        });
    });

    test('Day Calculator Modal Day Zero Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const startDate = screen.getByPlaceholderText('startDate');
            const endDate = screen.getByPlaceholderText('endDate');
            fireEvent.change(startDate, { target: { value: '2022-12-19' } });
            fireEvent.change(endDate, { target: { value: '2022-12-25' } });
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const numberOfDays = screen.getByPlaceholderText('numberOfDays') as HTMLInputElement;
            expect(numberOfDays.value).toBe('6');
        });
    });

    test('Day Calculator Modal Start Date Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const numberOfDays = screen.getByPlaceholderText('numberOfDays');
            const endDate = screen.getByPlaceholderText('endDate');
            fireEvent.change(numberOfDays, { target: { value: '6' } });
            fireEvent.change(endDate, { target: { value: '2022-12-25' } });
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const startDate = screen.getByPlaceholderText('startDate') as HTMLInputElement;
            expect(startDate.value).toBe('2022-12-19');
        });
    });

    test('Day Calculator Modal End Date Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const startDate = screen.getByPlaceholderText('startDate');
            const numberOfDays = screen.getByPlaceholderText('numberOfDays');
            fireEvent.change(startDate, { target: { value: '2022-12-19' } });
            fireEvent.change(numberOfDays, { target: { value: '6' } });
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const endDate = screen.getByPlaceholderText('endDate') as HTMLInputElement;
            expect(endDate.value).toBe('2022-12-25');
        });
    });
});
