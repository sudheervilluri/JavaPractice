import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ConcurrenyPackage {
public static void main(String[] args) {
	Runnable r1= new ThreadClass("test1");
	Runnable r2= new ThreadClass("test2");
	Runnable r3= new ThreadClass("test3");
	Runnable r4= new ThreadClass("test4");
	Runnable r5= new ThreadClass("test5");
	Runnable r6= new ThreadClass("test6");
	
	
	
	ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(3);
//	threadPoolExecutor.execute(r1);
//	threadPoolExecutor.execute(r2);
//	threadPoolExecutor.execute(r3);
//	threadPoolExecutor.execute(r4);
//	threadPoolExecutor.execute(r5);
//	threadPoolExecutor.execute(r6);
//	

	ThreadPoolExecutor cacheThreadPool = (ThreadPoolExecutor) Executors.newCachedThreadPool();
//	cacheThreadPool.execute(r1);
//	cacheThreadPool.execute(r2);
//	cacheThreadPool.execute(r4);
//	cacheThreadPool.execute(r3);
//	cacheThreadPool.execute(r5);
//	cacheThreadPool.execute(r6);
	
	ExecutorService executorService = Executors.newSingleThreadExecutor();
//	executorService.execute(r1);
//	executorService.execute(r2);
//	executorService.execute(r4);
//	executorService.execute(r3);
//	executorService.execute(r5);
//	executorService.execute(r6);
	
	ScheduledExecutorService scheduleService = Executors.newScheduledThreadPool(3);
	scheduleService.execute(r1);
//	scheduleService.execute(r2);
//	scheduleService.execute(r4);
//	scheduleService.execute(r3);
//	scheduleService.execute(r5);
//	scheduleService.execute(r6);
	scheduleService.scheduleAtFixedRate(r1, 1, 2, TimeUnit.MILLISECONDS);
	
	Thread t = new Thread(r1);
	t.setDaemon(true);
	t.start();
}
}
