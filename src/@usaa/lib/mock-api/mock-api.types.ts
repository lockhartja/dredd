import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UsaaMockApiReplyCallback =
    | ((data: { request: HttpRequest<any>; urlParams: { [key: string]: string } }) => ([number, string | any]) | Observable<any>)
    | undefined;

export type UsaaMockApiMethods =
    | 'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete';
