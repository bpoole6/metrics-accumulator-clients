package io.bpoole6.accumulator.metric.client;

import java.net.http.HttpResponse;

public class ClientResponse{
    private final HttpResponse<String> res;
    private final int statusCode;
    private final String content;
    public ClientResponse(HttpResponse<String> res){
      this.res = res;
      this.statusCode = res.statusCode();
      this.content = res.body();
    }

  public HttpResponse<String> getRes() {
    return res;
  }

  public int getStatusCode() {
    return statusCode;
  }

  public String getContent() {
    return content;
  }
}