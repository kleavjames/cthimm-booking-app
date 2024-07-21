import { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { Button } from "../ui/button";

type ConfirmModalProps = {
  children: React.ReactNode;
  show?: boolean;
  setShow: (show: boolean) => void;
  onDone: () => void;
  onClear: () => void;
};

export const ConfirmModal: FC<ConfirmModalProps> = ({
  children,
  show,
  setShow,
  onDone,
  onClear,
}) => {
  return (
    <Modal open={show}>
      <ModalContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <ModalHeader>
          <ModalTitle className="text-center">
            Thank you for booking!
          </ModalTitle>
          <ModalDescription className="text-center">
            Please take a{" "}
            <span className="font-bold text-blue-400">SCREEN SHOT</span> or{" "}
            <span className="font-bold text-blue-400">TAKE NOTE</span> of the{" "}
            <span className="text-blue-400">booking reference #</span> for
            payment confirmation.
          </ModalDescription>
        </ModalHeader>
        {children}
        <ModalFooter>
          <ModalClose asChild>
            <Button
              type="submit"
              onClick={() => {
                onDone();
                onClear();
                setShow(false);
              }}
            >
              Close
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
