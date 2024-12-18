import {API_URL} from "@/config/config.tsx";
import {getToken, tanggalTerimaFormat} from "@/utils/Helper.tsx";
import {CreateSuratRequest} from "@/model/request/CreateSuratRequest.tsx";
import {WebResponse} from "@/model/response/WebResponse.tsx";
import {ForListSuratResponse} from "@/model/response/ForListSuratResponse.tsx";
import {SuratResponse} from "@/model/response/SuratResponse.tsx";
import {UpdateSuratRequest} from "@/model/request/UpdateSuratRequest.tsx";
import {ArchiveSuratsRequest} from "@/model/request/ArchiveSuratsRequest.ts";

export async function createSurat(
  request: CreateSuratRequest,
  pdfFile: File | null
) {
  const body = new FormData()
  body.append("data", new Blob(
    [JSON.stringify(request)],
    {
      type: "application/json"
    }))
  if (pdfFile != null) {
    body.append("pdfFile", pdfFile)
  }

  const url: string = API_URL + "/api/surat";
  const options: object = {
    method: "POST",
    headers: {
      "X-API-TOKEN": getToken()
    },
    body: body,
  };

  const response = await fetch(url, options)
  if (!response.ok) {
    const error: WebResponse<null> = await response.json()
    throw error.errors
  }
  const data: WebResponse<string> = await response.json()
  return data
}

export async function searchSurat(
  year: number,
  nomorSurat?: string,
  page?: number,
  size?: number
) {

  const param = new URLSearchParams({
    "nomorSurat": nomorSurat ? nomorSurat : "",
    "tahun": year.toString(),
    "page": page ? page.toString() : "0",
    "size": size ? size.toString() : "20"
  })

  const url: string = API_URL + `/api/surat?${param}`;
  const options: object = {
    method: "GET",
    headers: {
      "X-API-TOKEN": getToken()
    }
  };

  const response = await fetch(url, options)
  if (!response.ok) {
    const error: WebResponse<null> = await response.json()
    throw error.errors
  }
  const data: WebResponse<ForListSuratResponse[]> = await response.json()
  return data
}

export async function getSuratById(idSurat: number): Promise<SuratResponse> {

  const url: string = API_URL + `/api/surat/${idSurat}`;
  const options: object = {
    method: "GET",
    headers: {
      "X-API-TOKEN": getToken()
    }
  };

  const response = await fetch(url, options)
  if (!response.ok) {
    const error: WebResponse<null> = await response.json()
    throw error.errors
  }
  const data: WebResponse<SuratResponse> = await response.json()
  return data.data
}

export async function updateSurat(
  idSurat: number,
  reqeust: UpdateSuratRequest | null,
  pdfFile?: File | null,
): Promise<string> {

  const body = new FormData()

  if (pdfFile != null) {
    body.append("pdfFile", pdfFile)
  }

  if (reqeust != null) {
    body.append("data", new Blob(
      [JSON.stringify(reqeust)],
      {
        type: "application/json"
      }
    ))
  }

  const url: string = API_URL + `/api/surat/${idSurat}`
  const options: object = {
    method: "POST",
    headers: {
      "X-API-TOKEN": getToken()
    },
    body: body
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    const error: WebResponse<null> = await response.json()
    throw error.errors
  }
  const data: WebResponse<string> = await response.json()
  return data.data;
}

export async function deleteSurat(idSurat: number): Promise<string> {

  const url: string = API_URL + `/api/surat/${idSurat}`;
  const options: object = {
    method: "DELETE",
    headers: {
      "X-API-TOKEN": getToken()
    }
  };

  const response = await fetch(url, options)
  if (!response.ok) {
    const error: WebResponse<null> = await response.json()
    throw error.errors
  }
  const data: WebResponse<string> = await response.json()
  return data.data
}

export async function handleUploadBerkas(idSurat: number, pdfFile: File) {

  const body = new FormData()
  body.append("pdfFile", pdfFile)

  const url: string = API_URL + `/api/surat/${idSurat}/upload`
  const options: object = {
    method: "POST",
    headers: {
      "X-API-TOKEN": getToken()
    },
    body: body
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    const errors: WebResponse<null> = await response.json()
    throw errors.errors
  }

  const data: WebResponse<string> = await response.json()
  return data.data
}

export async function downloadBerkas(idSurat: number) {

  const url: string = API_URL + `/api/surat/${idSurat}/download`
  const options: RequestInit = {
    method: "GET",
    headers: {
      "X-API-TOKEN": getToken(),
    }
  }

  const response = await fetch(url, options);
  return await response.blob();
}

export async function getSuratByDate(
  date: Date,
  page?: number,
  size?: number
): Promise<WebResponse<ForListSuratResponse[]>> {

  const param = new URLSearchParams({
    "tanggalTerima": tanggalTerimaFormat(date),
    "page": page ? page.toString() : "0",
    "size": size ? size.toString() : "20"
  })

  const url: string = API_URL + `/api/surat/getSuratByDate?${param}`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "X-API-TOKEN": getToken(),
    }
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    const error: WebResponse<null> = await response.json()
    throw error.errors
  }

  return await response.json()
}

export async function archiveSurat(listIdSurat: number[]) {
  const request: ArchiveSuratsRequest = {
    listIdSurat
  }

  const url: string = API_URL + `/api/surat/archive`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-TOKEN": getToken(),
    },
    body: JSON.stringify(request)
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    const error: WebResponse<null> = await response.json()
    throw error.errors
  }

  const data: WebResponse<string> = await response.json();
  return data;
}