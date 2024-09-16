import httpService from "@/services/httpService";

export const shortenUrl = async (url: string) => {
    if (!url) {
        return;
    }
    const path = `url/shorten?longUrl=${url}`;
    const response = await httpService.post(path, { });
    return response;
}

export const retrieveUrl = async (id: string) => {
    const response = await httpService.get(`url/${id}`);
    return response;
    
}

export const RetrieveUserUrl = async (userId: string) => {
    const response = await httpService.get(`url/users?user=${userId}`);
    return response;
}
