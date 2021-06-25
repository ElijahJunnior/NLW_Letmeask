import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useEffect } from 'react';

type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function Room() {

    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;

    useEffect(() => {

        // busco no Realtime Database os dados da sala selecionada 
        const roomRef = database.ref(`rooms/${roomId}`);


        // roomRef.once -  pegar uma vez todos os registros de elemento referenciado
        // roomRef.on -  pegar todos os registros (no inicio e sempre que ouver uma alteração) 
        roomRef.on('value', room => {

            //crio uma varivale com os dados contidos em room
            const databaseRoom = room.val();

            // Converto os questions selecionados em uma coleção de um deteminado tipo
            // Caso a const databaseRoom tenha vindo undefined passo uma obj vazio
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            // entries -> Converto o Record de Questions da Base em uma array
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                // map -> varre a array retornando um objeto que combine com o modelo da room
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            });

            // Exibe o titulo da sala
            setTitle(databaseRoom.title);

            // Exibe o titulo 
            setQuestions(parsedQuestions);

        })

    }, [roomId]);

    async function handleSendQuestion(event: FormEvent) {

        event.preventDefault();

        if (newQuestion === '') {
            return;
        }

        if (!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');

    }

    return (

        <div id="page-room" >

            <header>
                <div className="content" >
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>

                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span> {questions.length} pergunta(s) </span>}
                </div>

                <form onSubmit={handleSendQuestion}>

                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">

                        {user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span> {user.name} </span>
                            </div>
                        ) : (
                            <span> Para enviar uma pergunta, <button>faça seu login</button>. </span>
                        )}

                        <Button
                            type="submit" disabled={!user}> Enviar pergunta
                        </Button>

                    </div>

                </form>

                {JSON.stringify(questions)}

            </main>

        </div>
    )
}