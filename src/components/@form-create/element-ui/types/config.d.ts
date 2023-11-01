import { FormData, VNodeRule } from '@form-create/core'
import { ButtonProps } from 'element-plus'
import { Api } from './index'

type SizeObject = {
    span?: number
    offset?: number
}

type ComponentSize = 'large' | 'default' | 'small'

type ColProps = {
    tag?: string | 'div';
    span?: number | 24;
    offset?: number | 0;
    pull?: number | 0;
    push?: number | 0;
    xs?: number | SizeObject;
    sm?: number | SizeObject;
    md?: number | SizeObject;
    lg?: number | SizeObject;
    xl?: number | SizeObject;
}

type RowProps = {
    tag?: string | 'div',
    gutter?: number | 0,
    justify?: string | 'start',
    align?: string | 'top',
}

export interface OptionAttrs {
    col?: boolean | ColProps & {
        labelWidth?: number | string;
        show?: boolean;
    };
    row?: boolean | RowProps & {
        show?: boolean;
    };
    info?: boolean | VNodeRule & {
        show?: boolean;
        native?: boolean;
        icon?: string;
        align?: 'left' | 'right';
        info?: string;
    };
    wrap?: boolean | VNodeRule & {
        labelWidth?: string
        required?: boolean
        error?: string
        showMessage?: boolean
        inlineMessage?: boolean
        size?: ComponentSize
        show?: boolean;
    };
    form?: {
        inline?: boolean
        disabled?: boolean
        labelPosition?: string
        labelWidth?: string
        labelSuffix?: string
        showMessage?: boolean
        inlineMessage?: boolean
        statusIcon?: boolean
        validateOnRuleChange?: boolean
        size?: ComponentSize
        className?: any;
        col?: boolean;
    };

    submitBtn?: boolean | ButtonProps & {
        click?: Function;
        innerText?: string;
        show?: boolean;
    };

    resetBtn?: boolean | ButtonProps & {
        click?: Function;
        innerText?: string;
        show?: boolean;
    };

}

declare const optionAttrs: OptionAttrs & {
    title?: boolean | VNodeRule & {
        show?: boolean;
        native?: boolean;
        title: string;
    };
}

export interface CreatorAttrs {
    col(props: typeof optionAttrs.col): this;

    wrap(props: typeof optionAttrs.wrap): this;

    title(props: string | typeof optionAttrs.title): this;

    info(props: string | typeof optionAttrs.info): this;

    className(prop: string): this;

}

export interface RuleAttrs {
    col?: typeof optionAttrs.col;
    wrap?: typeof optionAttrs.wrap;
    title?: string | typeof optionAttrs.title;
    info?: string | typeof optionAttrs.info;
    className?: string;
}

export interface ApiAttrs {
    btn: {
        loading(loading: boolean): void;
        disabled(disabled: boolean): void;
        show(show: boolean): void;
    }
    resetBtn: {
        loading(loading: boolean): void;
        disabled(disabled: boolean): void;
        show(show: boolean): void;
    }

    submit(success: (formData: FormData, $f: Api) => void, fail: ($f: Api) => void): Promise<any>;

    clearValidateState(fields?: string | string[], clearSub?: boolean): void;

    clearSubValidateState(fields?: string | string[]): void;

    validate(callback?: (state: any) => void): Promise<any>;

    validateField(field: string, callback?: (state: any) => void): Promise<any>;

    submitBtnProps(props: ButtonProps): void;

    resetBtnProps(props: ButtonProps): void;

}
