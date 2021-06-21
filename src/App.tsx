import { Button } from './Components/Button'
import { FormField } from './Components/FormField'

import './services/firebase';

function App() {
  return (

    <>
      <h1> Hello World </h1>
      <FormField fieldType='text'> Nome </FormField>
      <FormField fieldType='email'> E-Mail </FormField>
      <FormField fieldType='password'> Senha </FormField>
      <Button text={'Gravar'} />
      <Button text='Cancelar' />
    </>

  );
}

export default App;
