import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { register } from '@slices';
import { useForm } from '@hooks';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerError } = useSelector((state) => state.user);
  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: ''
  });
  const { name, email, password } = values;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(register({ name, email, password })).unwrap();

      navigate('/profile', { replace: true });
    } catch (_) {}
  };

  return (
    <RegisterUI
      errorText={registerError?.message}
      email={email}
      userName={name}
      password={password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
