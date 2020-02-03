package Java8;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

@FunctionalInterface
interface Converter<F, T> {
	T convert(F from);
}

public class FunctionalInterface2 {
	public static void main(String[] args) {
		Converter<String, Integer> convert = (from) -> Integer.valueOf(from);

		Integer value = convert.convert("123");
		System.out.println(value);

		Predicate<String> predicate = (s) -> s.length() > 0;
		System.out.println(predicate.test("Hello"));
		System.out.println(predicate.negate().test("Hello"));

		Predicate<Boolean> nonNull = Objects::isNull;

		Function<String, Integer> toInteger = Integer::valueOf;
		System.out.println(toInteger.apply("85"));

		Supplier<Person> personSupplier = Person::new;
		personSupplier.get(); // new Person
		System.out.println(personSupplier.get());

		Optional<String> optional = Optional.of("bam");

		optional.isPresent(); // true
		optional.get(); // "bam"
		optional.orElse("fallback"); // "bam"

		optional.ifPresent((s) -> System.out.println(s.charAt(0)));

		List<String> stringCollection = new ArrayList<>();
		stringCollection.add("ddd2");
		stringCollection.add("aaa2");
		stringCollection.add("bbb1");
		stringCollection.add("aaa1");
		stringCollection.add("bbb3");
		stringCollection.add("ccc");
		stringCollection.add("bbb2");
		stringCollection.add("ddd1");

		
		stringCollection.stream().map(String::toUpperCase).sorted().filter(s -> s.startsWith("A"))
				.forEach(System.out::println);
	}
}
