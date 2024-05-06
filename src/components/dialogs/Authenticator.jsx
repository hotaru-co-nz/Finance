import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { AppData } from "../../App";

export default function Authenticator({ _isAuthenticated }) {
    const { db, _user } = useContext(AppData);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [formData, setFormData] = useState({ username: "", password: "" });

    useEffect(() => {
        onOpen();
    }, []);

    return (
        <Modal
            classNames={{ wrapper: "items-center" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton
            size="sm"
            motionProps={{
                variants: {
                    enter: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        scale: 0.9,
                        opacity: 0,
                        transition: {
                            duration: 0.3,
                            ease: "easeIn",
                        },
                    },
                },
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader></ModalHeader>
                        <ModalBody>
                            <Input
                                label="Username"
                                value={formData.username}
                                autoComplete="false"
                                onValueChange={(value) =>
                                    setFormData((prevState) => ({ ...prevState, username: value }))
                                }
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                autoComplete="false"
                                onValueChange={(value) =>
                                    setFormData((prevState) => ({ ...prevState, password: value }))
                                }
                            />
                        </ModalBody>
                        <ModalFooter className="justify-between items-center">
                            <Button color="default" size="sm" variant="light" onPress={onClose}>
                                {"Try HOTARU"}
                            </Button>
                            <Button
                                color="primary"
                                variant="flat"
                                onPress={async () => {
                                    if (await db.logIn()) {
                                        _user(await db.getUserData());
                                        _isAuthenticated(true);
                                        onClose();
                                    } else {
                                        console.log(
                                            "Login Failed. Please use correct credential or contact administrator."
                                        );
                                    }
                                }}
                            >
                                {"Login"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
