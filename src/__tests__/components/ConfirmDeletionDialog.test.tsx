import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDeletionDialog from 'components/ConfirmDeletionDialog';

it('should call onClose when clicking on the cancel button', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
        <ConfirmDeletionDialog open onClose={onClose} onConfirm={onConfirm} />
    );

    const cancelButton = screen.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    expect(onConfirm).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(1);
});

it('should call onConfirm when clicking on the confirm button', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
        <ConfirmDeletionDialog open onClose={onClose} onConfirm={onConfirm} />
    );

    const confirmButton = screen.getByTestId('confirm-button');
    await userEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);
});
