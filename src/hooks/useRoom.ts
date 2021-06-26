import { useEffect, useState } from "react";

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

export function useRoom(roomId: string) {

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');


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

    return { questions, title };

}