package io.bpoole6.accumulator.metric.client;


import io.prometheus.metrics.core.metrics.Counter;
import io.prometheus.metrics.expositionformats.PrometheusTextFormatWriter;
import io.prometheus.metrics.model.registry.PrometheusRegistry;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;

public class Client {


  private final String url;
  private final String xApiKey;
  private final HttpClient client;

  public Client(String url, String xApiKey) {
    if (Objects.isNull(url) || url.isBlank()) {
      throw new RuntimeException("url cannot be null");
    }
    this.url = stripForwardSlash(url);
    this.xApiKey = xApiKey;
    this.client = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();
  }

  public ClientResponse updateMetrics(String metricGroup, PrometheusRegistry registry) throws IOException, InterruptedException, URISyntaxException {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    new PrometheusTextFormatWriter(false).write(outputStream, registry.scrape());
    HttpRequest request = HttpRequest.newBuilder(generateUri("update/" + metricGroup))
            .POST(HttpRequest.BodyPublishers.ofByteArray(outputStream.toByteArray()))
            .header("x-api-key", this.xApiKey)
            .header("content-type","text/plain").build();
    HttpResponse<String> res = this.client.send(request, HttpResponse.BodyHandlers.ofString());
    return new ClientResponse(res);
  }

  public ClientResponse getMetricGroup(String metricGroup) throws IOException, InterruptedException, URISyntaxException {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    HttpRequest request = HttpRequest.newBuilder(generateUri("metrics/" + metricGroup)).GET().build();
    HttpResponse<String> res = this.client.send(request, HttpResponse.BodyHandlers.ofString());
    return new ClientResponse(res);
  }

  public ClientResponse reloadConfiguration() throws IOException, InterruptedException, URISyntaxException {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    HttpRequest request = HttpRequest.newBuilder(generateUri("reload-configuration")).PUT(HttpRequest.BodyPublishers.ofString("")).build();
    HttpResponse<String> res = this.client.send(request, HttpResponse.BodyHandlers.ofString());
    return new ClientResponse(res);
  }

  public ClientResponse resetMetricGroup(String metricGroup) throws IOException, InterruptedException, URISyntaxException {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    HttpRequest request = HttpRequest.newBuilder(generateUri("reset-metric-group/" + metricGroup)).PUT(HttpRequest.BodyPublishers.ofString("")).build();
    HttpResponse<String> res = this.client.send(request, HttpResponse.BodyHandlers.ofString());
    return new ClientResponse(res);
  }

  public ClientResponse serviceDiscovery() throws IOException, InterruptedException, URISyntaxException {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    HttpRequest request = HttpRequest.newBuilder(generateUri("service-discovery")).GET().build();
    HttpResponse<String> res = this.client.send(request, HttpResponse.BodyHandlers.ofString());
    return new ClientResponse(res);
  }

  public ClientResponse currentConfiguration() throws IOException, InterruptedException, URISyntaxException {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    HttpRequest request = HttpRequest.newBuilder(generateUri("current-configurations")).GET().build();
    HttpResponse<String> res = this.client.send(request, HttpResponse.BodyHandlers.ofString());
    return new ClientResponse(res);
  }


  private URI generateUri(String path) throws URISyntaxException {
    return new URI(String.format("%s/%s", this.url, path));
  }

  private String stripForwardSlash(String s) {
    if (s.charAt(s.length() - 1) != '/') {
      return s;
    }
    return stripForwardSlash(s.substring(0, s.length() - 1));
  }

  public static void main(String[] args) throws IOException, URISyntaxException, InterruptedException {
    PrometheusRegistry registry = new PrometheusRegistry();
    Counter c = Counter.builder().name("test_example_total").labelNames("app").register(registry);
    c.labelValues("app").inc();
    var client = new Client("http://localhost:8080", "0d98f65f-074b-4d56-b834-576e15a3bfa5");
    System.out.println(client.updateMetrics("default", registry).getContent());
    System.out.println(client.getMetricGroup("default").getContent());
    System.out.println(client.reloadConfiguration().getStatusCode());
    System.out.println(client.resetMetricGroup("default").getStatusCode());
    System.out.println(client.serviceDiscovery().getContent());
    System.out.println(client.currentConfiguration().getContent());
  }
}
