package HackerRanker.FrequencyQuires;

import static java.util.stream.Collectors.joining;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Solution {

	static List<Integer> freqQuery(List<int[]> queries) {

		HashMap<Integer, Integer> hash = new HashMap<Integer, Integer>();
		List<Integer> retList = new ArrayList<Integer>();

		for (int[] querie : queries) {
			int op = querie[0];
			int num = querie[1];
			if (op == 1) {
				if (!hash.containsKey(num))
					hash.put(num, 1);
				else
					hash.put(num, hash.get(num) + 1);
			} else if (op == 2) {
				if (hash.containsKey(num)) {
					if (hash.get(num) <= 1)
						hash.remove(num);
					else
						hash.put(num, hash.get(num) - 1);
				}

			} else if (op == 3) {
				if (hash.containsValue(num)) {
					retList.add(1);
				} else
					retList.add(0);

			}
		}

		return retList;

	}

	public static void main(String[] args) throws IOException {
		try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in))) {
			int q = Integer.parseInt(bufferedReader.readLine().trim());
			List<int[]> queries = new ArrayList<>(q);
			Pattern p = Pattern.compile("^(\\d+)\\s+(\\d+)\\s*$");
			for (int i = 0; i < q; i++) {
				int[] query = new int[2];
				Matcher m = p.matcher(bufferedReader.readLine());
				if (m.matches()) {
					query[0] = Integer.parseInt(m.group(1));
					query[1] = Integer.parseInt(m.group(2));
					queries.add(query);
				}
			}
			List<Integer> ans = freqQuery(queries);
			try (BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")))) {
				bufferedWriter.write(ans.stream().map(Object::toString).collect(joining("\n")) + "\n");
			}
		}
	}
}

//
//
//import java.io.*;
//import java.math.*;
//import java.security.*;
//import java.text.*;
//import java.util.*;
//import java.util.concurrent.*;
//import java.util.regex.*;
//import static java.util.stream.Collectors.joining;
//
//public class Solution {
//
//    static List<Integer> freqQuery(int[][] queries) {
//        List<Integer> ans = new ArrayList<>();
//        Map<Integer, Integer> map = new HashMap<>();
//        Map<Integer, Integer> map2 = new HashMap<>();
//        Integer oper = null;
//        Integer number = null;
//        for (int i = 0; i < queries.length; i++) {
//            oper = queries[i][0];
//            number = queries[i][1];
//            switch (oper) {
//                case 1:
//                    map2.compute(map.get(number), (key, value) -> value == null||value == 0 ? 0 : value - 1);
//                    map.compute(number, (key, value) -> value == null ? 1 : value + 1);
//                    map2.compute(map.get(number), (key, value) -> value == null||value == 0 ? 1 : value + 1);
//                    break;
//                case 2:
//                    map2.compute(map.get(number), (key, value) -> value == null || value == 0 ? 0 : value - 1);
//                    map.compute(number, (key, value) -> value == null || value == 0 ? value = 0 : value - 1);
//                    map2.compute(map.get(number), (key, value) -> value == null || value == 0 ? 1 : value + 1);
//                    break;
//                case 3:
//                    ans.add(map2.get(number) == null || map2.get(number) == 0 ? 0 : 1);
//                    break;
//            }
//        }
//        return ans;
//    }
//
//    public static void main(String[] args) throws IOException {
//        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in))) {
//            int q = Integer.parseInt(bufferedReader.readLine().trim());
//            int[][] queries = new int[q][2];
//            Pattern p = Pattern.compile("^(\\d+)\\s+(\\d+)\\s*$");
//            for (int i = 0; i < q; i++) {
//                Matcher m = p.matcher(bufferedReader.readLine());
//                if (m.matches()) {
//                    queries[i][0] = Integer.parseInt(m.group(1));
//                    queries[i][1] = Integer.parseInt(m.group(2));
//                }
//            }
//            List<Integer> ans = freqQuery(queries);
//
//            try (BufferedWriter bufferedWriter = new BufferedWriter(
//                    new FileWriter(System.getenv("OUTPUT_PATH")))) {
//
//                bufferedWriter.write(ans.stream().map(Object::toString)
//                        .collect(joining("\n")) + "\n");
//            }
//
//        }
//    }
//}