
import { ContentType } from "@sovrahq/ami-core";


export function getFileExtention( type: ContentType): string {
    switch(type){
        case ContentType.PDF:
            return 'pdf'
        default:
            return 'file'
    }
}