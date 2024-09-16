import { CustomButton } from "../ui/custom-button";
import { CustomInput } from "../ui/custom-input";
import { useRef, useState } from "react";
import { Link } from "lucide-react";
import { ValidateRegex } from "@/utils/inputs";
import { VALIDATORS } from "@/utils/inputs";

interface PruneInputProps {
    onChange: (value: string) => void;
    value: string;
    actionHandler: () => void;
    buttonText?: string;
    isLoading?: boolean;
    disabled?: boolean;
    validator?: string;
}

const PruneInput: React.FC<PruneInputProps> = ({
    onChange, 
    value, 
    actionHandler, 
    isLoading = false,
    buttonText,
    disabled = false,
    validator = VALIDATORS.URL,
 }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(true); // Default to true to avoid initial invalid state
    const inputRef = useRef(null);

    const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const isInputValid = ValidateRegex[validator].test(inputValue);
        setIsValid(isInputValid);
        onChange(inputValue);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    const handleFocus = () => {
        setIsFocused(true);
    }

    const isButtonDisabled = !value || disabled || !isValid;
    return (
        <div className={`relative flex items-center mb-8 bg-gray-800 rounded-full h-16 border-4 border-solid p-2 ${
            isFocused ? 'border-[#144EE3] ring-1 ring-blue-300' : isValid ? 'border-[#353C4A]' : 'border-red-400 ring-0 ring-red-300'
          }`}>
        {/* Link Icon */}
        <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {/* Input Field */}
        <CustomInput
          ref={inputRef}
          type="url"
          placeholder="Enter the link here"
          value={value}
          onChange={validateInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-grow pl-12 pr-24 bg-gray-800 text-white border-none rounded-full h-14"
        />
        {/* Button */}
        <CustomButton
          onClick={actionHandler}
          className="absolute right-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full h-10 px-8"
          size="sm"
          disabled={isButtonDisabled || isLoading}
          loading={isLoading}
        >
          {buttonText || `Prune Now!`}
        </CustomButton>
      </div>
    );
};
export default PruneInput;