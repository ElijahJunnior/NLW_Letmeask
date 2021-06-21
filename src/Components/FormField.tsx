import { useState } from 'react';

type FormFieldProps = {
    fieldType: string;
    children?: string;
}

export function FormField(props: FormFieldProps) {

    console.log(props.children)

    let name;
    const [buttonsPresseds, SetButtonsPresseds] = useState(0);

    // let buttonsPresseds = 0;

    if (props.children === undefined || props.children === '' || props.children === ' ') {
        name = 'N/A'
    } else {
        name = props.children;
    }

    function ContarCaracteres() {
        SetButtonsPresseds(buttonsPresseds + 1);
        console.log(buttonsPresseds);
    }

    return (
        <>
            <label> {name + `: ${String(buttonsPresseds)} `} </label>
            <input type={props.fieldType} onKeyPress={ContarCaracteres} ></input>
        </>
    )
}


