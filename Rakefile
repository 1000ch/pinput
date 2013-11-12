desc "create directories"
task :mkdir do
    FileUtils.mkdir("./tmp")
end

desc "copy files"
task :copy => [:mkdir] do
    FileUtils.cp_r("./src/html", "./tmp")
    FileUtils.cp_r("./src/css", "./tmp")
    FileUtils.cp_r("./src/js", "./tmp")
    FileUtils.cp_r("./src/icon", "./tmp")
    FileUtils.cp_r("./src/fonts", "./tmp")
    FileUtils.cp("./src/manifest.json", "./tmp")
end

desc "compress files"
task :compress => [:copy] do

end

desc "zip directory"
task :archive => [:compress] do
    sh "zip package.zip -r ./tmp"
end

desc "remove temporary files"
task :remove_tmp do
    FileUtils.remove_dir("./tmp")
end

task :default => [:archive, :remove_tmp]