import { useState } from 'react';
import { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';

export function NewRoom() {

    //const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {

        // impede que o formulario abra uma nova pagina no submit
        event.preventDefault();


    }

    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt='Ilustração simbolizando perguntas e respostas' />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt='Letmeask' />
                    <h2> Crair uma nova sala </h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type='text'
                            placeholder='Nome da sala'
                            onChange={event => setNewRoom(event.target.value)}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                        <p> Quer entrar em uma sala existente? <Link to='/' > clique aqui </Link> </p>
                    </form>
                </div>
            </main>
        </div>
    )
}