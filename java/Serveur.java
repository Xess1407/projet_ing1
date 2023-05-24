import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.JSONObject;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
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
            String requestPath = httpExchange.getRequestURI().getPath();

            LOGGER.log(Level.INFO, "[{0}] Call on \"{1}\"", new Object[] { httpExchange.getRequestMethod(), httpExchange.getRequestURI() });

            if (requestPath.equals(URL_ANALYZE)) {
                handleAnalysisRequest(httpExchange);
            } else if (requestPath.equals(URL_OCCURRENCES)) {
                handleOccurrencesRequest(httpExchange);
            }
        }

        private void handleAnalysisRequest(HttpExchange httpExchange) throws IOException {
            String filePath = null;

            if ("GET".equals(httpExchange.getRequestMethod())) {
                String queryString = httpExchange.getRequestURI().getQuery();
                String[] queryParams = queryString.split("&");

                for (String param : queryParams) {
                    String[] keyValue = param.split("=");
                    if (keyValue.length == 2 && keyValue[0].equals("file")) {
                        filePath = URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8);
                        break;
                    }
                }
            }

            JSONObject analysisResult = new JSONObject();
            try {
                BufferedReader reader = new BufferedReader(new FileReader(filePath));
                List<String> lines = new ArrayList<>();
                String line;
                while ((line = reader.readLine()) != null) {
                    lines.add(line);
                }
                reader.close();

                // Calculate number of lines
                int lineCount = lines.size();
                analysisResult.put("lineCount", lineCount);

                // Calculate number of functions
                int functionCount = calculateFunctionCount(lines);
                analysisResult.put("functionCount", functionCount);

                // Calculate minimum, maximum, and average lines of functions
                JSONObject linesStats = calculateLinesStats(lines);
                analysisResult.put("linesStats", linesStats);

            } catch (IOException e) {
                e.printStackTrace();
                analysisResult.put("error", "An error occurred during code analysis.");
            }

            httpExchange.getResponseHeaders().set("Content-Type", "application/json");
            httpExchange.sendResponseHeaders(200, analysisResult.toString().getBytes().length);

            LOGGER.log(Level.INFO, "[{0}] Response on \"{1}\" : \"{2}\"\n", new Object[] { httpExchange.getRequestMethod(), httpExchange.getRequestURI(), analysisResult.toString() });

            OutputStream outputStream = httpExchange.getResponseBody();
            outputStream.write(analysisResult.toString().getBytes());
            outputStream.flush();
            outputStream.close();
        }

        private void handleOccurrencesRequest(HttpExchange httpExchange) throws IOException {
            String filePath = null;
            String[] terms = null;

            if ("GET".equals(httpExchange.getRequestMethod())) {
                String queryString = httpExchange.getRequestURI().getQuery();
                String[] queryParams = queryString.split("&");

                for (String param : queryParams) {
                    String[] keyValue = param.split("=");
                    if (keyValue.length == 2) {
                        String key = URLDecoder.decode(keyValue[0], StandardCharsets.UTF_8);
                        String value = URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8);

                        if (key.equals("file")) {
                            filePath = value;
                        } else if (key.equals("terms")) {
                            String listeTermes = value;
                            terms = listeTermes.split(",");
                        }
                    }
                }
            }

            if (terms == null || terms.length == 0) {
                // Si les termes n'ont pas été fournis, renvoyer une erreur
                sendErrorResponse(httpExchange, "No terms provided.");
                return;
            }

            Map<String, Integer> termOccurrences = getTermOccurrences(filePath, terms);

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("termOccurrences", termOccurrences);

            String jsonStr = jsonResponse.toString();

            httpExchange.getResponseHeaders().set("Content-Type", "application/json");
            httpExchange.sendResponseHeaders(200, jsonStr.getBytes().length);

            LOGGER.log(Level.INFO, "[{0}] Response on \"{1}\" : \"{2}\"\n", new Object[] { httpExchange.getRequestMethod(), httpExchange.getRequestURI(), jsonStr });

            OutputStream outputStream = httpExchange.getResponseBody();
            outputStream.write(jsonStr.getBytes());
            outputStream.flush();
            outputStream.close();
        }

        private Map<String, Integer> getTermOccurrences(String filePath, String[] terms) throws IOException {
            Map<String, Integer> termOccurrences = new HashMap<>();

            File file = new File(filePath);
            Scanner scanner = new Scanner(file);

            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                for (String term : terms) {
                    int count = termOccurrences.getOrDefault(term, 0);
                    int occurrencesInLine = countOccurrencesInLine(line, term);
                    termOccurrences.put(term, count + occurrencesInLine);
                }
            }

            scanner.close();

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