import { useEffect, useState } from "react";

import { useAuth } from './useAuth';

import { database } from "../services/firebase";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

export function useRoom(roomId: string) {

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    const { user } = useAuth();

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
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            });

            // Exibe o titulo da sala
            setTitle(databaseRoom.title);

            // Exibe o titulo 
            setQuestions(parsedQuestions);

        })

        return () => {
            roomRef.off('value');
        }

    }, [roomId, user?.id]);

    return { questions, title };

}