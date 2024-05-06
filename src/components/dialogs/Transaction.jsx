import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollShadow,
    Select,
    SelectItem,
    Tab,
    Tabs,
    Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiCalendarLine,
    RiGroupLine,
    RiMoneyDollarCircleLine,
    RiPriceTagLine,
} from "@remixicon/react";
import dayjs, { getCalendar, getCurrentMonth, monthDecrease, monthIncrease, sameMonthDate } from "../../lib/dayjs";
import { useTransactions } from "../../hooks/useTransactions";
import { inputStyle, modalStyle, scrollShadowProps } from "../style.js";
import { useExchangeRates } from "../../hooks/useExchangeRates.js";
import { useTags } from "../../hooks/useTags.js";

export default function Transaction({ isOpen, onOpenChange, formEntity }) {
    const counterparties = { items: [{ key: "Countdown", Name: "Countdown" }] };
    const tags = useTags();
    const transactions = useTransactions();
    const exchangeRates = useExchangeRates();

    const [formData, _formData] = useState(transactions.new());
    const [formError, _formError] = useState({});

    const [calendarRange, _calendarRange] = useState(getCurrentMonth());
    const [calendarData, _calendarData] = useState();
    const [isCalendarOpen, _isCalendarOpen] = useState(false);

    const updateForm = (key, value) => _formData((prevState) => ({ ...prevState, [key]: value }));

    const updateError = (key, value) => _formError((prevState) => ({ ...prevState, [key]: value }));

    const validateForm = () => {
        _formError({});
        let i = 0;
        if (!formData.Counterparty)
            updateError("Counterparty", `${formData.IsExpense ? "Payee" : "Payer"} cannot be empty!`, i++);
        if (!formData.Amount) updateError("Amount", "Amount cannot be empty!", i++);
        if (Number(formData.Amount) < 0) updateError("Amount", "Amount cannot be negative!", i++);
        if (i > 0) return false;
        return true;
    };

    const StartIcon = ({ Icon }) => (
        <div className={inputStyle.startContent}>
            <Icon className="size-4" />
        </div>
    );

    useEffect(() => {
        _calendarData(getCalendar(calendarRange));
    }, [calendarRange]);

    useEffect(() => {
        // if (formEntity)
    }, [formEntity]);

    return (
        <Modal
            classNames={modalStyle.classNames}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton
            backdrop="blur"
            size={window.innerWidth < 768 ? "full" : "md"}
            motionProps={modalStyle.motionProps}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{"Create New Transaction"}</ModalHeader>
                        <ScrollShadow {...scrollShadowProps}>
                            <ModalBody>
                                <Popover isOpen={isCalendarOpen} onOpenChange={(open) => _isCalendarOpen(open)}>
                                    <PopoverTrigger>
                                        <Input
                                            aria-label="Date"
                                            label="Date"
                                            classNames={{ input: "text-left" }}
                                            autoComplete="false"
                                            isReadOnly
                                            value={dayjs(formData.Date).format("LL")}
                                            startContent={<StartIcon Icon={RiCalendarLine} />}
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-row w-full items-center">
                                            <div className="flex-1 font-bold">{`${calendarRange.year} ${calendarRange.month}`}</div>
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                onPress={() => _calendarRange(monthDecrease)}
                                            >
                                                <RiArrowLeftSLine className="size-5" />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                onPress={() => _calendarRange(monthIncrease)}
                                            >
                                                <RiArrowRightSLine className="size-5" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row w-full justify-around">
                                                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((v) => (
                                                    <div className="text-[.8em] w-unit-10 text-center">{v}</div>
                                                ))}
                                            </div>
                                            {calendarData?.map((week) => (
                                                <div className="flex flex-row">
                                                    {week?.map((day) => (
                                                        <Button
                                                            isIconOnly
                                                            variant={
                                                                sameMonthDate(formData.Date, day.month, day.date)
                                                                    ? "flat"
                                                                    : "light"
                                                            }
                                                            color={
                                                                sameMonthDate(formData.Date, day.month, day.date)
                                                                    ? "primary"
                                                                    : "default"
                                                            }
                                                            onPress={() => {
                                                                updateForm(
                                                                    "Date",
                                                                    dayjs([
                                                                        calendarRange.year,
                                                                        day.month,
                                                                        day.date,
                                                                    ]).format("YYYYMMDD")
                                                                );
                                                                _isCalendarOpen(false);
                                                            }}
                                                        >
                                                            <div
                                                                className={
                                                                    day.month !== calendarRange.month
                                                                        ? "opacity-50"
                                                                        : ""
                                                                }
                                                            >
                                                                {day.date}
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <Autocomplete
                                    aria-label="Counterparty"
                                    label={formData.IsExpense ? "Payee" : "Payer"}
                                    autoComplete="false"
                                    allowsCustomValue
                                    startContent={<StartIcon Icon={RiGroupLine} />}
                                    inputValue={formData.Counterparty}
                                    onInputChange={(value) => updateForm("Counterparty", value)}
                                    description={formError.Counterparty}
                                >
                                    {counterparties.items.map((value) => (
                                        <AutocompleteItem key={value.key}>{value.Name}</AutocompleteItem>
                                    ))}
                                </Autocomplete>
                                <Autocomplete
                                    aria-label="Tag"
                                    label="Tag"
                                    autoComplete="false"
                                    allowsCustomValue
                                    startContent={<StartIcon Icon={RiPriceTagLine} />}
                                    inputValue={formData.Tag}
                                    onInputChange={(value) => updateForm("Tag", value)}
                                    description={formError.Tag}
                                >
                                    {tags.items.map((value) => (
                                        <AutocompleteItem key={value.key}>{value.Name}</AutocompleteItem>
                                    ))}
                                </Autocomplete>
                                <Input
                                    aria-label="Amount"
                                    label="Amount"
                                    type="number"
                                    value={formData.Amount}
                                    autoComplete="false"
                                    onValueChange={(value) => updateForm("Amount", value)}
                                    startContent={<StartIcon Icon={RiMoneyDollarCircleLine} />}
                                    description={formError.Amount}
                                />
                                <div className="flex flex-row gap-3">
                                    <Tabs
                                        aria-label="Options"
                                        selectedKey={formData.IsExpense ? "e" : "i"}
                                        onSelectionChange={(value) => updateForm("IsExpense", value === "e")}
                                    >
                                        <Tab key={"e"} title="Expense"></Tab>
                                        <Tab key={"i"} title="Income"></Tab>
                                    </Tabs>
                                    <Select
                                        aria-label="ExchangeRates"
                                        autoComplete="false"
                                        selectedKeys={new Set([formData.Currency])}
                                        onSelectionChange={(values) =>
                                            updateForm("Currency", values.values().next().value)
                                        }
                                    >
                                        {exchangeRates.items.map((value) => (
                                            <SelectItem key={value.key} textValue={value.CurrencyCode}>
                                                {value.CurrencyCode}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <Textarea
                                    label={"Description"}
                                    placeholder=" "
                                    value={formData.Description}
                                    onValueChange={(value) => updateForm("Description", value)}
                                />
                            </ModalBody>
                        </ScrollShadow>
                        <ModalFooter className="">
                            <Button variant="flat" onPress={onClose}>
                                {"Cancel"}
                            </Button>
                            <Button
                                color="primary"
                                variant="flat"
                                onPress={async () => {
                                    if (validateForm()) {
                                        await transactions.insert(formData);
                                        onClose();
                                    }
                                }}
                            >
                                {"Submit"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
