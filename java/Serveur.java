import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.Headers;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.URLEncoder;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Serveur {
    // logger pour trace
    private static final Logger LOGGER = Logger.getLogger(Serveur.class.getName());
    private static final String SERVEUR = "localhost"; // url de base du service
    private static final int PORT = 8001; // port serveur
    private static final String URL_ANALYZE = "/analyze"; // URL pour l'analyse
    private static final String URL_OCCURRENCES = "/occurrences"; // URL pour les occurrences


    // boucle principale qui lance le serveur sur le port 8001, à l'url analyze
    public static void main(String[] args) {
        HttpServer server = null;
        try {
            server = HttpServer.create(new InetSocketAddress(SERVEUR, PORT), 0);

            server.createContext(URL_ANALYZE, new MyHttpHandler());
            server.createContext(URL_OCCURRENCES, new MyHttpHandler());

            ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
            server.setExecutor(threadPoolExecutor);
            server.start();

            LOGGER.info("Server started on port " + PORT);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

   private static class MyHttpHandler implements HttpHandler {
        // Interface method to be implemented
        @Override
        public void handle(HttpExchange httpExchange) throws IOException {
            // Ajouter le code pour autoriser les requêtes CORS
            Headers headers = httpExchange.getResponseHeaders();
            headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
            List<String> allowedMethods = Arrays.asList("GET", "POST", "OPTIONS");
            headers.set("Access-Control-Allow-Methods", String.join(",", allowedMethods));
            List<String> allowedHeaders = Arrays.asList("Content-Type");
            headers.set("Access-Control-Allow-Headers", String.join(",", allowedHeaders));
            headers.set("Access-Control-Max-Age", "3600");

            if (httpExchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

                httpExchange.sendResponseHeaders(200, -1);
                return;
            }

            String requestPath = httpExchange.getRequestURI().getPath();

            LOGGER.log(Level.INFO, "[{0}] Call on \"{1}\"", new Object[] { httpExchange.getRequestMethod(), httpExchange.getRequestURI() });

            if (requestPath.equals(URL_ANALYZE)) {
                handleAnalysisRequest(httpExchange);
            } else if (requestPath.equals(URL_OCCURRENCES)) {
                handleOccurrencesRequest(httpExchange);
            }
        }


        private void handleAnalysisRequest(HttpExchange httpExchange) throws IOException {
            Integer data_project_id = null;
            Integer user_id = null;
            String file_name = null;
            String file_content = null;

            if ("POST".equals(httpExchange.getRequestMethod())) {
                InputStreamReader isr = new InputStreamReader(httpExchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(isr);
                StringBuilder requestBody = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    requestBody.append(line);
                }

                JSONObject jsonObject = new JSONObject(requestBody.toString());

                if (jsonObject.has("data_project_id")) {
                    data_project_id = jsonObject.getInt("data_project_id");
                }

                if (jsonObject.has("user_id")) {
                    user_id = jsonObject.getInt("user_id");
                }

                if (jsonObject.has("file_name")) {
                    file_name = jsonObject.getString("file_name");
                }

                if (jsonObject.has("file_content")) {
                    file_content = jsonObject.getString("file_content");
                }
            }

            if(data_project_id != null && user_id != null && file_name != null && file_content != null) {
                JSONObject jsonData = new JSONObject();
                try {
                    List<String> lines = Arrays.asList(file_content.split("\n"));

                    // Calculate number of lines
                    int lineCount = lines.size();
                    jsonData.put("lineCount", lineCount);

                    // Calculate number of functions
                    int functionCount = calculateFunctionCount(lines);
                    jsonData.put("functionCount", functionCount);

                    // Calculate minimum, maximum, and average lines of functions
                    JSONObject linesStats = calculateLinesStats(lines);
                    jsonData.put("linesStats", linesStats);

                } catch (Exception e) {
                    e.printStackTrace();
                }

                LOGGER.log(Level.INFO, "[{0}] Response on \"{1}\" : \"{2}\"\n", new Object[] { httpExchange.getRequestMethod(), httpExchange.getRequestURI(), jsonData.toString() });

                // Appeler la méthode makeAnalyticsRequest pour envoyer les données d'analyse
                makeAnalyticsRequest(httpExchange, data_project_id, user_id, file_name, jsonData);
            } else {
                sendErrorResponse(httpExchange, "Wrong data on localhost:8001/analyze !");
                return;
            }
        }

        private void handleOccurrencesRequest(HttpExchange httpExchange) throws IOException {
            Integer data_project_id = null;
            Integer user_id = null;
            String file_name = null;
            String file_content = null;
            String[] terms = null;

            if ("POST".equals(httpExchange.getRequestMethod())) {
                InputStreamReader isr = new InputStreamReader(httpExchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(isr);
                StringBuilder requestBody = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    requestBody.append(line);
                }

                JSONObject jsonObject = new JSONObject(requestBody.toString());

                if (jsonObject.has("data_project_id")) {
                    data_project_id = jsonObject.getInt("data_project_id");
                }

                if (jsonObject.has("user_id")) {
                    user_id = jsonObject.getInt("user_id");
                }

                if (jsonObject.has("file_name")) {
                    file_name = jsonObject.getString("file_name");
                }

                if (jsonObject.has("file_content")) {
                    file_content = jsonObject.getString("file_content");
                }

                if (jsonObject.has("terms")) {
                    String termsStr = jsonObject.getString("terms");
                    terms = termsStr.split(",");
                }
            }

            if(data_project_id != null && user_id != null && file_name != null && file_content != null && terms != null) {
                Map<String, Integer> termOccurrences = getTermOccurrences(file_content, terms);

                JSONObject jsonData = new JSONObject();
                jsonData.put("termOccurrences", termOccurrences);

                LOGGER.log(Level.INFO, "[{0}] Response on \"{1}\" : \"{2}\"\n", new Object[] { httpExchange.getRequestMethod(), httpExchange.getRequestURI(), jsonData.toString() });

                // Appeler la méthode makeAnalyticsRequest pour envoyer les données d'analyse
                makeAnalyticsRequest(httpExchange, data_project_id, user_id, file_name, jsonData);
            } else {
                sendErrorResponse(httpExchange, "Wrong data on localhost:8001/occurrences !");
                return;
            }
        }

        private void makeAnalyticsRequest(HttpExchange httpExchange, Integer data_project_id, Integer user_id, String file_name, JSONObject jsonData) throws IOException {
            String apiUrl = "http://localhost:8080/api/analytics";

            // Construire les données de la requête
            StringBuilder requestBody = new StringBuilder();
            requestBody.append("data_project_id=").append(data_project_id);
            requestBody.append("&user_id=").append(user_id);
            requestBody.append("&file_name=").append(URLEncoder.encode(file_name, StandardCharsets.UTF_8));
            requestBody.append("&json_data=").append(URLEncoder.encode(jsonData.toString(), StandardCharsets.UTF_8));

            // Créer la connexion HTTP
            HttpURLConnection connection = (HttpURLConnection) new URL(apiUrl).openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

            // Écrire les données dans le corps de la requête
            try (OutputStream outputStream = connection.getOutputStream()) {
                outputStream.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            }

            // Récupérer la réponse du serveur
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // La requête a réussi
                // Vous pouvez traiter la réponse ici si nécessaire
                System.out.println("Analytics request sent successfully");
            } else {
                // La requête a échoué
                System.err.println("Analytics request failed with response code: " + responseCode);
            }

            // Fermer la connexion
            connection.disconnect();

            httpExchange.sendResponseHeaders(200, jsonData.toString().getBytes().length);

            // Écriture de la réponse dans le corps de la réponse
            OutputStream outputStream = httpExchange.getResponseBody();
            outputStream.write(jsonData.toString().getBytes());
            outputStream.flush();
            outputStream.close();
        }

        private Map<String, Integer> getTermOccurrences(String file_content, String[] terms) throws IOException {
            Map<String, Integer> termOccurrences = new HashMap<>();

            List<String> lines = Arrays.asList(file_content.split("\n"));

            for (String line : lines) {
                for (String term : terms) {
                    int count = termOccurrences.getOrDefault(term, 0);
                    int occurrencesInLine = countOccurrencesInLine(line, term);
                    termOccurrences.put(term, count + occurrencesInLine);
                }
            }

            return termOccurrences;
        }

        private int countOccurrencesInLine(String line, String term) {
            int count = 0;
            int index = line.indexOf(term);
            while (index != -1) {
                count++;
                index = line.indexOf(term, index + term.length());
            }
            return count;
        }

        private void sendErrorResponse(HttpExchange httpExchange, String message) throws IOException {
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("error", message);

            String jsonStr = jsonResponse.toString();

            httpExchange.getResponseHeaders().set("Content-Type", "application/json");
            httpExchange.sendResponseHeaders(400, jsonStr.getBytes().length);

            OutputStream outputStream = httpExchange.getResponseBody();
            outputStream.write(jsonStr.getBytes());
            outputStream.flush();
            outputStream.close();
        }

        /**
         * Calculate the number of functions in the code
         *
         * @param lines List of code lines
         * @return Number of functions
         */
        private int calculateFunctionCount(List<String> lines) {
            int functionCount = 0;
            boolean insideFunction = false;
            for (String line : lines) {
                line = line.strip();
                if (line.startsWith("def ") && line.endsWith(":")) {
                    if (!insideFunction) {
                        functionCount++;
                        insideFunction = true;
                    }
                } else if (line.equals("") || line.startsWith("#")) {
                    // Skip empty lines or comments
                    continue;
                } else {
                    insideFunction = false;
                }
            }
            return functionCount;
        }

        /**
         * Calculate the minimum, maximum, and average lines of functions
         *
         * @param lines List of code lines
         * @return JSON object containing lines statistics
         */
        private JSONObject calculateLinesStats(List<String> lines) {
            JSONObject linesStats = new JSONObject();
            List<Integer> functionLines = new ArrayList<>();
            int currentFunctionLines = 0;
            boolean insideFunction = false;
            for (String line : lines) {
                line = line.strip();
                if (line.startsWith("def ") && line.endsWith(":")) {
                    if (!insideFunction) {
                        if (currentFunctionLines > 0) {
                            functionLines.add(currentFunctionLines);
                        }
                        currentFunctionLines = 0;
                        insideFunction = true;
                    }
                } else if (line.equals("") || line.startsWith("#")) {
                    // Skip empty lines or comments
                    continue;
                } else {
                    currentFunctionLines++;
                    insideFunction = false;
                }
            }
            if (currentFunctionLines > 0) {
                functionLines.add(currentFunctionLines);
            }

            int minLines = functionLines.isEmpty() ? 0 : functionLines.stream().min(Integer::compareTo).get();
            int maxLines = functionLines.isEmpty() ? 0 : functionLines.stream().max(Integer::compareTo).get();
            double avgLines = functionLines.isEmpty() ? 0 : functionLines.stream().mapToDouble(Integer::doubleValue).average().getAsDouble();

            linesStats.put("minLines", minLines);
            linesStats.put("maxLines", maxLines);
            linesStats.put("avgLines", avgLines);

            return linesStats;
        }
    }
}
