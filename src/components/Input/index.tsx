import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useField } from '@unform/core';
import { Container, Error, EyeButton } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  showPassword?: any;
  passwordVisible?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  icon: Icon,
  type,
  showPassword,
  passwordVisible,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const EyeIcon = useCallback(
    () => (
      <EyeButton
        onClick={() => {
          passwordVisible ? showPassword(false) : showPassword(true);
        }}
      >
        {passwordVisible ? <FiEye size={20} /> : <FiEyeOff size={20} />}
      </EyeButton>
    ),
    [passwordVisible, showPassword],
  );

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        {...rest}
        type={passwordVisible ? 'text' : type}
        ref={inputRef}
      />
      {type === 'password' && <EyeIcon />}
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
