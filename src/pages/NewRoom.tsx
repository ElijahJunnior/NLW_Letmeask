import { useState } from 'react';
import { FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';

export function NewRoom() {

    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {

        // impede que o formulario abra uma nova pagina no submit
        event.preventDefault();

        // valida se o usuario informou o nome da sala
        if (newRoom === '') {
            return;
        }

        // cria/faz referencia a um grupo de objetos na RelatimeDatabase
        const roomRef = database.ref('rooms');

        // Adiciona um novo elemento no grupo referenciado na RealtimeDatabase
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        // Navega até a pagina usando a key do registro na base
        history.push(`/admin/rooms/${firebaseRoom.key}`)

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
                            value={newRoom}
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