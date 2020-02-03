import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class StreamExample {
	public static void main(String[] args) {
		List<Integer> list = Arrays.asList(88,1,2,3,4,5,6,7,8,9);
		//list.stream().forEach( s -> System.out.println(s));
		//list.stream().filter(s -> s>5).forEach( s -> System.out.println(s));
	//	list.stream().sorted().forEach( s -> System.out.println(s));
		Set<Integer> s = list.stream().filter(s2 -> s2>5).map(x->x).collect(Collectors.toSet());
		s.stream().forEach(s4->System.out.println(s4));
		
	}
}
